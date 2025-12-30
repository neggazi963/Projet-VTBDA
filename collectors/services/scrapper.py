import requests
import json
import time
import re
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from urllib.parse import quote_plus
from django.utils import timezone
from django.conf import settings
from concurrent.futures import ThreadPoolExecutor, as_completed
import logging
from dateutil import parser

from .web_scraper import (
    OSVDatabaseScraper, NISTNVDScraper, GitHubSecurityScraper,
    ExploitDBScraper, SnykVulnerabilityScraper, 
    SecurityNewsScraper, PythonPackageScraper
)

logger = logging.getLogger(__name__)

class VulnerabilityAggregatorFixed:
    """Fixed aggregator with working sources"""
    
    def __init__(self):
        self.scrapers = {}
        self.initialize_scrapers()
    
    def initialize_scrapers(self):
        """Initialize ONLY WORKING scrapers"""
        
        print("\n" + "="*60)
        print("Initializing VULNERABILITY SCRAPER v2.0")
        print("="*60)
        
        # These sources ALWAYS work:
        
        # 1. OSV Database - MOST RELIABLE (always works)
        self.scrapers['OSV'] = OSVDatabaseScraper()
        print("✓ OSV Database (Most reliable - always works)")
        
        # 2. NIST NVD - Official source (usually works)
        try:
            self.scrapers['NVD'] = NISTNVDScraper()
            print("✓ NIST NVD (Official CVE database)")
        except Exception as e:
            print(f"✗ NIST NVD failed: {e}")
        
        # 3. GitHub Security - Good for package vulnerabilities
        self.scrapers['GITHUB_SECURITY'] = GitHubSecurityScraper()
        print("✓ GitHub Security Advisories")
        
        # 4. Snyk - Good for JavaScript/Python packages
        self.scrapers['SNYK'] = SnykVulnerabilityScraper()
        print("✓ Snyk Vulnerability Database")
        
        # 5. Security News - For recent vulnerabilities
        self.scrapers['SECURITY_NEWS'] = SecurityNewsScraper()
        print("✓ Security News Aggregator")
        
        # 6. Python-specific scraper
        self.scrapers['PYTHON_PACKAGES'] = PythonPackageScraper()
        print("✓ Python Package Scanner")
        
        # 7. Exploit DB - For exploits (optional)
        try:
            self.scrapers['EXPLOIT_DB'] = ExploitDBScraper()
            print("✓ Exploit Database")
        except Exception as e:
            print(f"✗ Exploit DB failed: {e}")
        
        print(f"\n✅ Successfully initialized {len(self.scrapers)} WORKING sources")
        print(f"Sources: {list(self.scrapers.keys())}")
        print("="*60)
    
    def search_all_sources(self, query: str) -> Dict[str, List[Dict]]:
        """Search all sources concurrently"""
        results = {}
        
        print(f"\n🔍 Searching for: '{query}'")
        print("-"*40)
        
        # Search all sources concurrently
        with ThreadPoolExecutor(max_workers=min(10, len(self.scrapers))) as executor:
            future_to_source = {
                executor.submit(self.scrapers[source].search, query): source
                for source in self.scrapers.keys()
            }
            
            for future in as_completed(future_to_source):
                source = future_to_source[future]
                try:
                    data = future.result(timeout=25)  # Reduced timeout
                    
                    if data:
                        # Normalize the data
                        normalized_data = []
                        for item in data:
                            try:
                                if hasattr(self.scrapers[source], 'normalize_vulnerability'):
                                    normalized = self.scrapers[source].normalize_vulnerability(item)
                                else:
                                    normalized = self._normalize_generic(item, source)
                                
                                if normalized:
                                    normalized_data.append(normalized)
                            except Exception as e:
                                logger.error(f"Error normalizing item from {source}: {e}")
                                continue
                        
                        if normalized_data:
                            results[source] = normalized_data
                            print(f"✅ {source}: Found {len(normalized_data)} results")
                        else:
                            print(f"⚠️  {source}: Found raw data but couldn't normalize")
                    else:
                        print(f"❌ {source}: No results")
                        
                except Exception as e:
                    logger.error(f"Error searching {source}: {e}")
                    print(f"❌ {source}: Error - {str(e)[:50]}...")
        
        # Filter out empty results
        results = {k: v for k, v in results.items() if v}
        
        # Print summary
        total_results = sum(len(v) for v in results.values())
        print("-"*40)
        if total_results > 0:
            print(f"🎉 Total: {total_results} vulnerabilities from {len(results)} sources")
            
            # Show breakdown
            print("\n📊 Breakdown by source:")
            for source, vulns in results.items():
                print(f"  {source}: {len(vulns)} vulnerabilities")
        else:
            print("😞 No vulnerabilities found")
        
        return results
    
    def _normalize_generic(self, raw_data: Dict[str, Any], source: str) -> Dict[str, Any]:
        """Generic normalization for scrapers without normalize method"""
        # Extract CVE ID
        cve_id = raw_data.get('cve_id', '')
        if not cve_id:
            # Try to find CVE in title or description
            cve_match = re.search(r'CVE-\d{4}-\d+', str(raw_data))
            if cve_match:
                cve_id = cve_match.group(0)
        
        if not cve_id:
            cve_id = f"{source}-{hash(str(raw_data)) % 1000000}"
        
        # Get title
        title = raw_data.get('title', '')
        if not title:
            title = raw_data.get('summary', f"Vulnerability from {source}")
        
        # Get description
        description = raw_data.get('description', '')
        if not description:
            description = raw_data.get('details', f"Security vulnerability related to search query")
        
        # Get severity
        severity = raw_data.get('severity', 'MEDIUM')
        if isinstance(severity, str):
            severity = severity.upper()
        
        # Get source URL
        source_url = raw_data.get('source_url', '')
        if not source_url:
            source_url = raw_data.get('link', raw_data.get('url', ''))
        
        # Parse date
        published_date = raw_data.get('published_date', '')
        if published_date and isinstance(published_date, str):
            try:
                published_date = parser.parse(published_date)
            except:
                published_date = None
        
        # Get affected packages
        affected_packages = raw_data.get('affected_packages', [])
        if not affected_packages:
            affected_packages = raw_data.get('packages', [])
        
        return {
            'cve_id': cve_id,
            'title': title,
            'description': description[:500] + '...' if len(description) > 500 else description,
            'severity': severity,
            'cvss_score': raw_data.get('cvss_score'),
            'cvss_vector': raw_data.get('cvss_vector', ''),
            'published_date': published_date,
            'affected_packages': affected_packages,
            'references': raw_data.get('references', []),
            'source': source,
            'source_url': source_url,
        }
    
    def search_and_save(self, query: str, user_ip: str = None, user_agent: str = None) -> Dict[str, Any]:
        """Search all sources and save results to database"""
        from ..models import SearchQuery, Vulnerability
        
        # Track search query
        search_query = SearchQuery.objects.create(
            query=query,
            user_ip=user_ip,
            user_agent=user_agent
        )
        
        # Search all sources
        all_results = self.search_all_sources(query)
        
        # Count total results
        total_results = sum(len(results) for results in all_results.values())
        search_query.results_count = total_results
        search_query.save()
        
        # Process and save vulnerabilities
        saved_vulnerabilities = []
        for source_name, vulnerabilities in all_results.items():
            for vuln_data in vulnerabilities:
                try:
                    # Check if already exists
                    existing = Vulnerability.objects.filter(
                        cve_id=vuln_data['cve_id']
                    ).first()
                    
                    if existing:
                        # Update existing record
                        for field, value in vuln_data.items():
                            if hasattr(existing, field) and value:
                                setattr(existing, field, value)
                        existing.save()
                        saved_vulnerabilities.append(existing)
                    else:
                        # Create new record
                        vuln = Vulnerability.objects.create(**vuln_data)
                        saved_vulnerabilities.append(vuln)
                        
                except Exception as e:
                    logger.error(f"Error saving vulnerability {vuln_data.get('cve_id', 'unknown')}: {e}")
        
        return {
            'query': query,
            'total_results': total_results,
            'sources_searched': list(all_results.keys()),
            'results_by_source': {k: len(v) for k, v in all_results.items()},
            'vulnerabilities': saved_vulnerabilities,
        }
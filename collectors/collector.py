from django.http import JsonResponse
from django.db.models import Q
import json
import time

from requests import request

from .models import Vulnerability, SearchQuery
from .services.scrapper import  VulnerabilityAggregatorFixed


def harvestData(query: str, user_ip: str = None, user_agent: str = None):
    try:
        # Initialize the aggregator and search
        aggregator = VulnerabilityAggregatorFixed()
                
        # Define sources to search (web scrapers + API)
        sources_to_search = [
            # Web scrapers (no API key needed)
            'SECURITY_FOCUS', 'PACKETSTORM', 'SECURITY_TRACKER',
            'SNYK_WEB', 'MITRE_CWE', 'CYBER_NEWS',
            # API sources
            'CISA'
        ]
                
        # Try NVD if available
        try:
            sources_to_search.append('NVD')
        except:
            pass
                
        print(f"Searching sources: {sources_to_search}")
                
        # Search all sources
        results = aggregator.search_all_sources(query)
                
        # Save search query
        search_record = SearchQuery.objects.create(
            query=query,
            user_ip=user_ip,
            user_agent=user_agent,
            results_count=sum(len(vulns) for vulns in results.values())
        )
                
        # Process results
        all_vulnerabilities = []
        saved_count = 0
                
        for source_name, vulnerabilities in results.items():
            for vuln_data in vulnerabilities:
                vuln_dict = {}
                if vuln_data.get('cve_id') or vuln_data.get('title'):
                    # Generate CVE ID if missing
                    if not vuln_data.get('cve_id'):
                        vuln_data['cve_id'] = f"{source_name}-{int(time.time())}-{hash(vuln_data.get('title', ''))}"
                    
                    all_vulnerabilities.append({
                        'cve_id': vuln_data.get('cve_id', ''),
                        'title': vuln_data.get('title', ''),
                        'description': vuln_data.get('description', '')[:300] + '...' if len(vuln_data.get('description', '')) > 300 else vuln_data.get('description', ''),
                        'severity': vuln_data.get('severity', 'MEDIUM'),
                        'cvss_score': vuln_data.get('cvss_score'),
                        'source': source_name,
                        'source_url': vuln_data.get('source_url', ''),
                        'published_date': str(vuln_data.get('published_date', '')),
                        'affected_packages': vuln_data.get('affected_packages', [])[:3],
                    })  
                    # Try to save to database
                    try:
                        # Check if already exists
                        existing = Vulnerability.objects.filter(
                            Q(cve_id=vuln_data['cve_id']) | 
                            Q(title=vuln_data.get('title', ''))
                        ).first()
                                
                        # Prepare data for saving
                        if not existing:
                            vuln_dict = {
                                'cve_id': vuln_data.get('cve_id', ''),
                                'title': vuln_data.get('title', ''),
                                'description': vuln_data.get('description', ''),
                                'severity': vuln_data.get('severity', 'MEDIUM'),
                                'cvss_score': vuln_data.get('cvss_score'),
                                'cvss_vector': vuln_data.get('cvss_vector', ''),
                                'source_url': vuln_data.get('source_url', ''),
                                'affected_packages': json.dumps(vuln_data.get('affected_packages', [])),
                                'references': json.dumps(vuln_data.get('references', [])),
                            }
                                    
                            # Handle published date
                            published_date = vuln_data.get('published_date')
                            if published_date:
                                vuln_dict['published_date'] = published_date
                                        
                            # Create new vulnerability
                            vuln = Vulnerability.objects.create(**vuln_dict)
                            saved_count += 1
                                
                    except Exception as e:
                        print(f"Error processing vulnerability from {source_name}: {e}")
        print(f"Saved {saved_count} vulnerabilities to database") 
        return {
            'success': True,
            'query': query,
            'search_id': search_record.id,
            'total_found': len(all_vulnerabilities),
            'saved_to_db': saved_count,
            'results_by_source': {k: len(v) for k, v in results.items()},
            'vulnerabilities': all_vulnerabilities,
        }
                
    except Exception as e:
        print(e)
        return {
            'error': str(e),
            'success': False
        }
from datetime import timezone
from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.core.paginator import Paginator
from django.db.models import Q
import json
import time

from collectors.collector import harvestData

from .models import Vulnerability, SearchQuery, VulnerabilitySource
from .services.scrapper import  VulnerabilityAggregatorFixed

class DeleteDataView(View):
    def get(self, request):
        Vulnerability.objects.all().delete()
        SearchQuery.objects.all().delete()
        VulnerabilitySource.objects.all().delete()
        return JsonResponse({'message': 'Data deleted successfully'})

class HomeView(View):
    """Home page with search form"""
    
    def get(self, request):
        recent_searches = SearchQuery.objects.all().order_by('-created_at')[:10]
        recent_vulnerabilities = Vulnerability.objects.all().order_by('-published_date')[:5]
        
        context = {
            'recent_searches': recent_searches,
            'recent_vulnerabilities': recent_vulnerabilities,
        }
        return render(request, 'collectors/home.html', context)


@method_decorator(csrf_exempt, name='dispatch')
class SearchVulnerabilitiesView(View):
    """API endpoint to search vulnerabilities from all sources"""
    
    def get(self, request):
        """Display search page or show results from database"""
        query = request.GET.get('q', '')
        page = request.GET.get('page', 1)
        limit = int(request.GET.get('limit', 20))
        
        if query:
            # Search in existing database
            vulnerabilities = Vulnerability.objects.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(cve_id__icontains=query) |
                Q(affected_packages__icontains=query)
            ).order_by('-published_date', '-cvss_score')
        else:
            vulnerabilities = Vulnerability.objects.all().order_by('-published_date')
        
        # Pagination
        paginator = Paginator(vulnerabilities, limit)
        page_obj = paginator.get_page(page)
        
        # Format for template
        vuln_list = []
        for vuln in page_obj:
            vuln_list.append({
                'id': vuln.id,
                'cve_id': vuln.cve_id,
                'title': vuln.title,
                'description': vuln.description[:200] + '...' if len(vuln.description) > 200 else vuln.description,
                'severity': vuln.severity,
                'cvss_score': float(vuln.cvss_score) if vuln.cvss_score else None,
                'published_date': vuln.published_date.strftime('%Y-%m-%d') if vuln.published_date else '',
                'source': vuln.source.name if vuln.source else 'Unknown',
                'source_url': vuln.source_url,
            })
        
        context = {
            'query': query,
            'vulnerabilities': vuln_list,
            'page': page,
            'total_pages': paginator.num_pages,
            'total_results': paginator.count,
            'has_previous': page_obj.has_previous(),
            'has_next': page_obj.has_next(),
        }
        
        return render(request, 'collectors/search_results.html', context)
    
    def post(self, request):
        """API endpoint to perform new search from external sources"""
        
        #remove all lines in models
        data = json.loads(request.body.decode('utf-8'))
        query = data.get('query', '').strip()
        
        if not query or len(query) < 2:
            return JsonResponse({
                'error': 'Query must be at least 2 characters long',
                'success': False
            }, status=400)
        user_ip = request.META.get('REMOTE_ADDR')
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        data = harvestData(query, user_ip, user_agent)
        if data.get('error'):
            return JsonResponse(data, status=500)
        else:
            return JsonResponse(data)
            

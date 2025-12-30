from django.db import models
import json

class VulnerabilitySource(models.Model):
    """Sources where vulnerabilities are fetched from"""
    name = models.CharField(max_length=100)
    source_type = models.CharField(max_length=50)
    api_url = models.URLField(max_length=500, blank=True, null=True)
    api_key = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name


class Vulnerability(models.Model):
    """Main vulnerability model"""
    SEVERITY_CHOICES = [
        ('CRITICAL', 'Critical'),
        ('HIGH', 'High'),
        ('MEDIUM', 'Medium'),
        ('LOW', 'Low'),
    ]
    
    # Basic identifiers
    cve_id = models.CharField(max_length=50, unique=True, db_index=True)
    title = models.CharField(max_length=500)
    description = models.TextField()
    
    # Severity and metrics
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    cvss_score = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    cvss_vector = models.CharField(max_length=200, blank=True)
    
    # Source information
    source = models.ForeignKey(VulnerabilitySource, on_delete=models.SET_NULL, null=True, blank=True)
    source_url = models.URLField(max_length=500, blank=True)
    
    # Dates
    # published_date = models.DateTimeField(null=True, blank=True)
    published_date = models.CharField(max_length=250, null=True, blank=True)
    
    # JSON data stored as text
    affected_packages = models.TextField(default='[]')  # Store as JSON string
    references = models.TextField(default='[]')  # Store as JSON string
    tags = models.TextField(default='[]')  # Store as JSON string
    
    # Search fields
    search_vector = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-published_date', '-cvss_score']
    
    def __str__(self):
        return f"{self.cve_id}: {self.title}"
    
    def get_affected_packages(self):
        """Get affected packages as list"""
        try:
            return json.loads(self.affected_packages)
        except:
            return []
    
    def get_references(self):
        """Get references as list"""
        try:
            return json.loads(self.references)
        except:
            return []
    
    def get_tags(self):
        """Get tags as list"""
        try:
            return json.loads(self.tags)
        except:
            return []


class SearchQuery(models.Model):
    """Track search queries for analytics"""
    query = models.CharField(max_length=500)
    source = models.CharField(max_length=100, blank=True)
    results_count = models.IntegerField(default=0)
    user_ip = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
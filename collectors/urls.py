from django.urls import path
from . import views

urlpatterns = [
    path('', views.HomeView.as_view(), name='home'),
    path('api/search/', views.SearchVulnerabilitiesView.as_view(), name='api_search'),
    # path('search/', views.SearchVulnerabilitiesView.as_view(), name='search'),
    # path('vulnerability/<str:cve_id>/', views.VulnerabilityDetailView.as_view(), name='vulnerability_detail'),
    # path('vulnerability/id/<int:vuln_id>/', views.VulnerabilityDetailView.as_view(), name='vulnerability_detail_id'),
    # path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    # path('api/clear/', views.ClearDatabaseView.as_view(), name='clear_database'),
    # path('api/export/', views.ExportDataView.as_view(), name='export_data'),
    path('api/delete/', views.DeleteDataView.as_view(), name='delete_data'),
]
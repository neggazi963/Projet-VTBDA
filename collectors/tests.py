from .models import Vulnerability,SearchQuery,VulnerabilitySource 

if __name__ == '__main__':
#clear tables
    Vulnerability.objects.all().delete()
    SearchQuery.objects.all().delete()
    VulnerabilitySource.objects.all().delete()
    #kill server
    import os
    os.kill(os.getpid(), 9)
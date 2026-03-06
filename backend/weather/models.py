from django.db import models

class SearchHistory(models.Model):
    city       = models.CharField(max_length=100)
    searched_at = models.DateTimeField(auto_now_add=True)
    country    = models.CharField(max_length=100, blank=True)
    temp_c     = models.FloatField(null=True, blank=True)
    condition  = models.CharField(max_length=200, blank=True)

    class Meta:
        ordering = ['-searched_at']

    def __str__(self):
        return f"{self.city} ({self.searched_at.strftime('%Y-%m-%d %H:%M')})"

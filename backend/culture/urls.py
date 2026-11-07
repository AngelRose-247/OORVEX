from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints
    path('districts/', views.district_list, name='district-list'),
    path('districts/<slug:slug>/', views.district_detail, name='district-detail'),
    path('categories/', views.category_list, name='category-list'),
    path('listings/', views.listing_list, name='listing-list'),
    path('listings/<int:pk>/', views.listing_detail, name='listing-detail'),
    path('glossary/', views.glossary_list, name='glossary-list'),
    path('contributions/', views.contribution_create, name='contribution-create'),
    path('ai/discover/', views.ai_discover, name='ai-discover'),

    # Admin moderation endpoints
    path('admin/contributions/', views.admin_contributions, name='admin-contributions'),
    path('admin/contributions/<int:pk>/approve/', views.admin_approve_contribution, name='admin-approve-contribution'),
    path('admin/contributions/<int:pk>/reject/', views.admin_reject_contribution, name='admin-reject-contribution'),
]

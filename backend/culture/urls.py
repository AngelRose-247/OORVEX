from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints
    path('districts/', views.district_list, name='district-list'),
    path('districts/<slug:slug>/', views.district_detail, name='district-detail'),
    path('categories/', views.category_list, name='category-list'),
    path('listings/', views.listing_list, name='listing-list'),
    path('listings/<int:pk>/', views.listing_detail, name='listing-detail'),
    
    # Art-form aliases as specified in problem definition
    path('artforms/', views.listing_list, name='artform-list'),
    path('artforms/<int:pk>/', views.listing_detail, name='artform-detail'),

    # Cultural places and performance venues
    path('places/', views.cultural_place_list, name='cultural-place-list'),

    path('glossary/', views.glossary_list, name='glossary-list'),
    path('contributions/', views.contribution_create, name='contribution-create'),
    path('ai/discover/', views.ai_discover, name='ai-discover'),

    # Admin moderation endpoints
    path('admin/contributions/', views.admin_contributions, name='admin-contributions'),
    path('admin/contributions/<int:pk>/approve/', views.admin_approve_contribution, name='admin-approve-contribution'),
    path('admin/contributions/<int:pk>/reject/', views.admin_reject_contribution, name='admin-reject-contribution'),
    path('admin/artforms/<int:pk>/image/', views.admin_update_artform_image, name='admin-update-artform-image'),
    path('admin/artforms/<int:pk>/status/', views.admin_update_curator_status, name='admin-update-curator-status'),
]

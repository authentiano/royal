from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Member
from .serializer import MemberSerializer
from accounts.permissions import IsSuperAdmin, IsAdministrator, IsAuthenticatedRole


# Create your views here.

class MemberViewSet(ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    
    # Option 1: Use predefined permission classes
    # permission_classes = [IsAdministrator | IsSuperAdmin]
    
    # Option 2: Allow any authenticated user (for testing)
    permission_classes = [IsAuthenticatedRole]
    
    # Option 3: Custom permission logic (uncomment to use)
    # def get_permissions(self):
    #     if self.action in ['create', 'update', 'partial_update', 'destroy']:
    #         # Only admins can modify
    #         return [IsAdministrator() | IsSuperAdmin()]
    #     else:
    #         # Any authenticated user can view
    #         return [IsAuthenticatedRole()]

    
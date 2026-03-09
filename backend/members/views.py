from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from . models import Member
from . serializer import MemberSerializer
from accounts.permissions import isAdministrator, isSuperAdmin


# Create your views here.

class MemberViewSet(ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [isAdministrator | isSuperAdmin]

    
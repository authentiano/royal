from rest_framework import serializers

from . models import Member

class  MemberSerializer(serializers.ModelSerializer):
    class meta:
        model = Member
        fields = "__all__"
    

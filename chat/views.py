from django.shortcuts import render_to_response
from django.http import *
from django.views.decorators.http import require_http_methods

from models import ChatRoom
from models import Users

def index(request):
    return render_to_response('index.html')

# no check for conflicting user names
# no password

# no cookie yet
@require_http_methods(["POST"])
def check(request):
    name = request.POST['username']
    chat = ChatRoom.objects.get(name="DRRR")
    try:
        ic = request.POST['icon']
    except:
        ic = {}
    if not Users.objects.filter(username = name):
        #return HttpResponse(Users.objects.filter(username = name))
        if not ic:
            # better to stay on the same page
            return HttpResponse("Please select an icon")
        else:
            new = Users(username = name,
                       icon = ic)
            new.save()
            return render_to_response('room.html', {'user': new, 'chat': chat})
    else:
        u = Users.objects.get(username = name)
        if u.icon == ic:
            return render_to_response('room.html', {'user': u, 'chat': chat})
        else:
            u.icon = ic
            u.save()
            return render_to_response('room.html', {'user': u, 'chat': chat})

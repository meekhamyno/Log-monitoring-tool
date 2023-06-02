from django.http import HttpResponse
from log_mon.log_reader import start_all_log_reader_threads, kill_all_log_reader_threads
from log_monitor.settings import LOG_MONITOR_ROOT_DIR as root_dir
from log_mon.models import Logs
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime
from zoneinfo import ZoneInfo

start_all_log_reader_threads(root_dir)

def index(request):
    return HttpResponse('Log Monitoring Tool')

@csrf_exempt
def get_logs(request):
    response_data = { "logs": list(Logs.objects.values().all()) }
    return HttpResponse(json.dumps(response_data, default=str), content_type="application/json")

@csrf_exempt
def handle_log(request):
    if not 'log_id' in request.data:
        return HttpResponse(json.dumps({"type": "HandleLogResponse", "status": "failure", "reason": "log_id not prasent" }, default=str),
                                        content_type="application/json")
    if not 'comment' in request.data:
        return HttpResponse(json.dumps({"type": "HandleLogResponse", "status": "failure", "reason": "comment not prasent" }, default=str),
                                        content_type="application/json")
    log_id = request.data['log_id']
    comment = request.data['comment']
    timestamp = datetime.now()
    Logs.objects.filter(id=log_id).update(handled_by=request.user.get_email(), handled_time=timestamp, comment=comment)
    
    return HttpResponse(json.dumps({"type": "HandleLogResponse", "status": "success" }, default=str), content_type="application/json")
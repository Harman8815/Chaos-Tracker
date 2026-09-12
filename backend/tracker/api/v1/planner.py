"""Thin v1 controller for planner data."""
from rest_framework import status

from .._base import TrackerAPIView
from ...domain.services import planner_service


class PlannerDataView(TrackerAPIView):
    def get(self, request):
        data = planner_service.get(request.user)
        return self.ok(data={"planner": data})

    def put(self, request):
        planner_service.replace_all(request.user, request.data)
        return self.ok(message="Planner data updated successfully")

    def patch(self, request):
        planner_service.patch(request.user, request.data)
        return self.ok(message="Planner data updated successfully")


class PlannerBlockDetailView(TrackerAPIView):
    def get(self, request, block_id):
        block = planner_service.get_block_by_id(request.user, block_id)
        tasks = [
            {"id": t.id, "text": t.text, "completed": t.completed}
            for t in block.tasks.all()
        ]
        return self.ok(data={
            "block": {
                "id": block.id,
                "title": block.title,
                "x": block.x,
                "y": block.y,
                "tasks": tasks,
            }
        })

    def put(self, request, block_id):
        planner_service.update_block(request.user, block_id, request.data)
        return self.ok(message="Block updated successfully")

    def delete(self, request, block_id):
        planner_service.delete_block(request.user, block_id)
        return self.ok(message="Block deleted successfully", status_code=status.HTTP_204_NO_CONTENT)
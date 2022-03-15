class TodoAPI {
    async getAllTasks() {
        try {
            const response = await fetch('http://localhost:5003/api/tasks/');
            return response.json()
        } catch(error) {
            console.log("getAll task" + error)
        }
    }

    async createTask(task) {
        try {
            const response = await fetch('http://localhost:5003/api/tasks', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "text" : task.text,
                    "checked": task.checked
                })
            })
            return response.json()

        } catch(error) {
            console.log("Create task" + error)
        }
    }
    async deleteTask (taskId) {
        try {
            await fetch(`http://localhost:5003/api/tasks/`+ taskId, {
                method: 'DELETE'
            })
        } catch(error) {
            console.log('Delete task error ', error)
        }
    }
    async updateTasks(taskId, taskText, taskChecked) {
        try {
            const response = await fetch(`http://localhost:5003/api/tasks/`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    "_id": taskId,
                    "text": taskText,
                    "checked": taskChecked
                })
            });
        return response.json();
        } catch(error) {
            console.log("updateTasks error" + error)
        }
    }
}
export default new TodoAPI();
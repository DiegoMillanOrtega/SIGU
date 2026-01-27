package com.example.sigu.service.implementation.google;


import com.example.sigu.persistence.entity.Tarea;
import com.example.sigu.service.exception.GoogleIntegrationException;
import com.example.sigu.util.mapper.GoogleTaskMapper;
import com.google.api.client.util.DateTime;
import com.google.api.services.tasks.model.Task;
import com.google.api.services.tasks.model.TaskList;
import com.google.api.services.tasks.model.TaskLists;
import com.google.api.services.tasks.model.Tasks;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleTasksService {

    private final com.google.api.services.tasks.Tasks tasks;
    private final GoogleTaskMapper googleTaskMapper;

    //Obtener todas las listas de tareas
    public List<TaskList> getAllTaskLists() throws IOException {
        TaskLists result = tasks.tasklists().list()
                .setMaxResults(10)
                .execute();


        return result.getItems() != null ? result.getItems() : new ArrayList<>();
    }

    //Crea una nueva lista de tareas
    public TaskList createTaskList(String title) throws IOException {
        TaskList taskList = new TaskList();
        taskList.setTitle(title);
        log.info("Creando task list {}", title);
        return tasks.tasklists().insert(taskList).execute();
    }

    public TaskList patchTaskList(String taskListId, String newTitle) throws IOException {
        TaskList content = new TaskList();
        content.setTitle(newTitle);
        log.info("Actualizando el task list {}", taskListId);
        return tasks.tasklists().patch(taskListId, content).execute();
    }

    //Obtiene todas las tareas de una lista específica
    public List<Task> getTasks(String taskListId) throws IOException {
        Tasks result = tasks.tasks()
                .list(taskListId)
                .execute();

        return result.getItems() != null ? result.getItems() : new ArrayList<>();
    }

    public String getOrCreateTaskList(String taskListName) throws IOException {
        List<TaskList> allTaskList = getAllTaskLists();

        return Optional.ofNullable(allTaskList)
                .orElse(Collections.emptyList())
                .stream()
                .filter(list -> taskListName.equalsIgnoreCase(list.getTitle()))
                .findFirst()
                .map(TaskList::getId)
                .orElseGet(() -> {
                    try {
                        return createTaskList(taskListName).getId();
                    } catch (IOException e) {
                        throw new GoogleIntegrationException("Error al crear la TaskList en Google", e);
                    }
                });
    }

    //Crea una nueva tarea en una lista específica
    public Task createTask(String taskListId, Task task) throws IOException {
        log.info("Insertando tarea en Google Tasks: {}", task.getTitle());
        return tasks.tasks().insert(taskListId, task).execute();
    }


    //Actualiza una tarea existente
    public Task updateTask(String taskListId, String taskId, Task task) throws IOException {
        return tasks.tasks().update(taskListId, taskId, task).execute();
    }

    public void patchTask(String taskListId, String taskId, Task taskPatch) throws IOException {
        log.info("Actualizando tarea {} en la lista {}", taskId, taskListId);
        tasks.tasks().patch(taskListId, taskId, taskPatch).execute();
    }

    //Marca una tarea como completada
    public Task completeTask(String taskListId, String taskId) throws IOException {
        Task task = tasks.tasks().get(taskListId, taskId).execute();
        task.setStatus("completed");

        return tasks.tasks().update(taskListId, taskId, task).execute();
    }

    //Elimina una tarea
    public void deleteTask(String taskListId, String taskId) throws IOException {
        tasks.tasks().delete(taskListId, taskId).execute();
    }

    //Elimina una lista de tareas
    public void deleteTaskList(String taskListId) throws IOException {
        tasks.tasklists().delete(taskListId).execute();
    }

    private String getPrioridadEmoji(String prioridad) {
        if (prioridad == null) return "⚪";

        return switch (prioridad.toLowerCase()) {
            case "alta" -> "🔴";
            case "media" -> "🟡";
            case "baja" -> "🟢";
            default -> "⚪";
        };
    }

}

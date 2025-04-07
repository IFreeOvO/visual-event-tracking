import type { Project } from '@/models/vo/project.vo'
import { objectToQuery } from '@/shared/object-to-query'
import request from '../request'

export function getProjects(data: Api.commonGetDto) {
    const query = objectToQuery(data)
    return request.get<Api.commonGetResp<Project>>(`/project?${query}`)
}

export function createProject(data: Omit<Project, 'id'>) {
    return request.post<Project>('/project', data)
}

export function deleteProject(id: number) {
    return request.delete(`/project/${id}`)
}

export function updateProject(params: Partial<Omit<Project, 'projectUrl'>>) {
    const id = params.id
    delete params.id
    return request.patch(`/project/${id}`, params)
}

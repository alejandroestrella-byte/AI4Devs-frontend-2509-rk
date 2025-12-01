import { PrismaClient, Prisma } from '@prisma/client';
import { Education } from './Education';
import { WorkExperience } from './WorkExperience';
import { Resume } from './Resume';
import { Application } from './Application';

const prisma = new PrismaClient();

/**
 * Convierte una fecha en formato string a ISO-8601 DateTime
 * Si la fecha ya es un objeto Date, lo retorna tal cual
 * Si es un string sin hora, agrega la hora por defecto (00:00:00)
 */
const convertToDateTime = (date: string | Date | null | undefined): Date | null | undefined => {
    if (!date) return date as null | undefined;
    if (date instanceof Date) return date;
    
    // Si es un string en formato YYYY-MM-DD, agregar la hora
    if (typeof date === 'string') {
        // Si ya tiene hora, retornar como Date
        if (date.includes('T') || date.includes(' ')) {
            return new Date(date);
        }
        // Si solo tiene fecha, agregar hora por defecto
        return new Date(`${date}T00:00:00.000Z`);
    }
    
    return date;
};

export class Candidate {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    educations: Education[];
    workExperiences: WorkExperience[];
    resumes: Resume[];
    applications: Application[];

    constructor(data: any) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.phone = data.phone;
        this.address = data.address;
        this.educations = data.educations || [];
        this.workExperiences = data.workExperiences || [];
        this.resumes = data.resumes || [];
        this.applications = data.applications || [];
    }

    async save() {
        const candidateData: any = {};

        // Solo añadir al objeto candidateData los campos que no son undefined
        if (this.firstName !== undefined) candidateData.firstName = this.firstName;
        if (this.lastName !== undefined) candidateData.lastName = this.lastName;
        if (this.email !== undefined) candidateData.email = this.email;
        if (this.phone !== undefined) candidateData.phone = this.phone;
        if (this.address !== undefined) candidateData.address = this.address;

        // Añadir educations si hay alguna para añadir
        if (this.educations.length > 0) {
            candidateData.educations = {
                create: this.educations.map(edu => ({
                    institution: edu.institution,
                    title: edu.title,
                    startDate: convertToDateTime(edu.startDate),
                    endDate: convertToDateTime(edu.endDate)
                }))
            };
        }

        // Añadir workExperiences si hay alguna para añadir
        if (this.workExperiences.length > 0) {
            candidateData.workExperiences = {
                create: this.workExperiences.map(exp => ({
                    company: exp.company,
                    position: exp.position,
                    description: exp.description,
                    startDate: convertToDateTime(exp.startDate),
                    endDate: convertToDateTime(exp.endDate)
                }))
            };
        }

        // Añadir resumes si hay alguno para añadir
        if (this.resumes.length > 0) {
            candidateData.resumes = {
                create: this.resumes.map(resume => ({
                    filePath: resume.filePath,
                    fileType: resume.fileType
                }))
            };
        }

        // Añadir applications si hay alguna para añadir
        if (this.applications.length > 0) {
            candidateData.applications = {
                create: this.applications.map(app => ({
                    positionId: app.positionId,
                    candidateId: app.candidateId,
                    applicationDate: app.applicationDate,
                    currentInterviewStep: app.currentInterviewStep,
                    notes: app.notes,
                }))
            };
        }

        if (this.id) {
            // Actualizar un candidato existente
            try {
                return await prisma.candidate.update({
                    where: { id: this.id },
                    data: candidateData
                });
            } catch (error: any) {
                console.log(error);
                if (error instanceof Prisma.PrismaClientInitializationError) {
                    // Database connection error
                    throw new Error('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
                } else if (error.code === 'P2025') {
                    // Record not found error
                    throw new Error('No se pudo encontrar el registro del candidato con el ID proporcionado.');
                } else {
                    throw error;
                }
            }
        } else {
            // Crear un nuevo candidato
            try {
                const result = await prisma.candidate.create({
                    data: candidateData
                });
                return result;
            } catch (error: any) {
                if (error instanceof Prisma.PrismaClientInitializationError) {
                    // Database connection error
                    throw new Error('No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.');
                } else {
                    throw error;
                }
            }
        }
    }

    static async findOne(id: number): Promise<Candidate | null> {
        const data = await prisma.candidate.findUnique({
            where: { id: id },
            include: {
                educations: true,
                workExperiences: true,
                resumes: true,
                applications: {
                    include: {
                        position: {
                            select: {
                                id: true,
                                title: true
                            }
                        },
                        interviews: {
                            select: {
                                interviewDate: true,
                                interviewStep: {
                                    select: {
                                        name: true
                                    }
                                },
                                notes: true,
                                score: true
                            }
                        }
                    }
                }
            }
        });
        if (!data) return null;
        return new Candidate(data);
    }
}

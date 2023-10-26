import { Injectable } from '@nestjs/common';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IssuesService {
  constructor(private prisma: PrismaService) {}
  create(createIssueDto: CreateIssueDto) {
    return this.prisma.issue.create({ data: createIssueDto });
  }

  async findOne(issueId: number) {
    return this.prisma.issue.findUnique({
      where: { id: issueId },
      include: { comment: { include: { user: true } } },
    });
  }

  findByProject(projectId: number) {
    return this.prisma.issue.findMany({ where: { projectId: projectId } });
  }

  update(id: number, updateIssueDto: UpdateIssueDto) {
    return this.prisma.issue.update({ where: { id }, data: updateIssueDto });
  }

  remove(id: number) {
    return this.prisma.issue.delete({ where: { id } });
  }
}

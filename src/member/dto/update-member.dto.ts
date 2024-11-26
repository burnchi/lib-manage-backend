import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberDto } from 'src/member/dto/create-member.dto';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {}

import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    this.logger.log(`회원가입 처리 시작: ${registerDto.email}`);

    // 이메일 중복 체크
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      this.logger.warn(`회원가입 실패 - 이메일 중복: ${registerDto.email}`);
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    // 사용자 생성
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: registerDto.password, // 실제로는 비밀번호 해싱이 필요합니다
        name: registerDto.name,
      },
    });

    this.logger.log(`회원가입 완료: ${user.email} (ID: ${user.id})`);

    // JWT 토큰 생성
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async login(loginDto: { email: string; password: string }) {
    this.logger.log(`로그인 처리 시작: ${loginDto.email}`);

    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      this.logger.warn(`로그인 실패 - 사용자 없음: ${loginDto.email}`);
      throw new Error('User not found');
    }

    // 실제로는 비밀번호 해싱을 비교해야 합니다
    if (user.password !== loginDto.password) {
      this.logger.warn(`로그인 실패 - 비밀번호 불일치: ${loginDto.email}`);
      throw new Error('Invalid password');
    }

    this.logger.log(`로그인 성공: ${user.email} (ID: ${user.id})`);

    // JWT 토큰 생성
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}

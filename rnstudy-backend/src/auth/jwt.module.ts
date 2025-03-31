import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key', // 실제 환경에서는 환경 변수로 관리해야 합니다
      signOptions: {
        expiresIn: '15m', // Access Token은 15분
      },
    }),
  ],
  exports: [JwtModule],
})
export class JwtAuthModule {}

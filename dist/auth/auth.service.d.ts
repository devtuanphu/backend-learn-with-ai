import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        user: Partial<User>;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: Partial<User>;
    }>;
    private generateToken;
    getProfile(userId: string): Promise<Partial<User>>;
}

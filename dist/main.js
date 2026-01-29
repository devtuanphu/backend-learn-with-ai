"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const typeorm_1 = require("typeorm");
const exercise_templates_seed_1 = require("./database/seeds/exercise-templates.seed");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['*'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Backend running on http://localhost:${port}`);
    try {
        const dataSource = app.get(typeorm_1.DataSource);
        await (0, exercise_templates_seed_1.seedExerciseTemplates)(dataSource);
    }
    catch (error) {
        console.error('❌ Error seeding exercise templates:', error);
    }
}
void bootstrap();
//# sourceMappingURL=main.js.map
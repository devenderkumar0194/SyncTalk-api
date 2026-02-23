import { Body, Controller, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from 'src/guard/decorators/role.decorators';
import { UserRole } from 'src/database/schemas/user.schema';
import { AuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/role.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AddProductDto } from './dto/product.dto';

@Controller('product')
export class ProductController {

    constructor(
        private readonly ProductService: ProductService,
    ) { }

        
    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_STAFF)
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth('authorization')
    @Post()
    async add(@Request() req: any, @Body() dto: AddProductDto ) {
        try {
            const data = await this.ProductService.add(req, dto);
            const response = {
                success: true,
                message: `Add Product successfully!`,
                data: data,
            };
            return response;
        } catch (err) {
            throw err;
        }
    }
    
    


}

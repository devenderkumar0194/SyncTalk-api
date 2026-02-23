import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { DatabaseService } from 'src/database/database.service';
import { AddProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {

    constructor(
        private readonly Model: DatabaseService,
        private readonly CommonService: CommonService,
    ) {
    }
    
    async add(req : any, dto : AddProductDto){
        return { data : dto };
    }

}

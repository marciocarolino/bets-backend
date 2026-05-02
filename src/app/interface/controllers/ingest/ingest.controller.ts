import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

import { IngestSagaStartUsecase } from "../../../application/services/saga/ingest/ingest.usecase";
import { SagaContextDuplicateException } from "../../../utils/exception.utils";
import { IngestRequestDto } from "./dto/ingest-request.dto";

@ApiTags("Ingest")
@Controller("ingest")
export class IngestController {
  constructor(
    private readonly ingestSagaStartUsecase: IngestSagaStartUsecase,
  ) {}

  @Post(":sagaName")
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({ status: 202, description: "Saga created successfully" })
  @ApiResponse({ status: 409, description: "Duplicate saga context" })
  @ApiResponse({ status: 400, description: "Invalid request body" })
  async ingest(
    @Param("sagaName") sagaName: string,
    @Body() body: IngestRequestDto,
  ) {
    try {
      return await this.ingestSagaStartUsecase.execute({
        sagaName,
        rawData: body.rawData,
        externalId: body.externalId,
      });
    } catch (error) {
      if (error instanceof SagaContextDuplicateException) {
        throw error.toHttpException();
      }
      throw error;
    }
  }
}

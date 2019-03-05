import { Field, ObjectType, registerEnumType } from "type-graphql";

export enum OperationResultCode {
    success = "success",
    error = "error",
}

registerEnumType(OperationResultCode, { name: "OperationResultCode" });

@ObjectType()
export default class OperationResult {
    @Field(type => OperationResultCode)
    code: OperationResultCode;

    @Field()
    message: string;

    static createSuccessResult(message: string = 'OK') {
        const operationResult = new OperationResult();

        operationResult.code = OperationResultCode.success;
        operationResult.message = message;

        return operationResult;
    }
}

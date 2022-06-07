import { S3Handler } from "aws-lambda";
import { S3 } from "aws-sdk";

export const handler: S3Handler = (event) => {
  console.log("N Consistido", event.Records[0].s3);
};

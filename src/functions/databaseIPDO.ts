import { S3Handler } from "aws-lambda";

export const handler: S3Handler = async (event) => {
  console.log(event)
};

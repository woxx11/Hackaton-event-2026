import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import * as customersService from "./customers.service";

export const listCustomersHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json(await customersService.listCustomers(req.auth!, req.query as never));
});

export const getCustomerHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json(await customersService.getCustomer(req.auth!, req.params.id));
});

export const createCustomerHandler = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json(await customersService.createCustomer(req.auth!, req.body));
});

export const updateCustomerHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json(await customersService.updateCustomer(req.auth!, req.params.id, req.body));
});

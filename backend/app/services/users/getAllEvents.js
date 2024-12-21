import * as eventRepository from "../../repositories/users/getAllEvents";
import {
  checkPaginationParams,
  checkSortParams,
} from "../../middleware/checkValidation";

export const getAllEvents = async (queryParams) => {
  const { page, limit } = checkPaginationParams(
    queryParams.page,
    queryParams.limit
  );
  const { sort, order } = checkSortParams(queryParams.sort, queryParams.order);

  return await eventRepository.getAllEvents({
    page,
    limit,
    sort,
    order,
  });
};

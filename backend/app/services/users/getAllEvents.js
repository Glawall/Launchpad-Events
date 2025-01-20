import * as eventRepository from "../../repositories/users/getAllEvents";
import {
  checkPaginationParams,
  checkSortParams,
  checkEventTypeId,
} from "../../middleware/checkValidation";

export const getAllEvents = async (queryParams) => {
  const { page, limit } = checkPaginationParams(
    queryParams.page,
    queryParams.limit
  );
  const { sort, order } = checkSortParams(queryParams.sort, queryParams.order);
  const type_id = queryParams.type_id
    ? checkEventTypeId(queryParams.type_id)
    : undefined;

  return await eventRepository.getAllEvents({
    page,
    limit,
    sort,
    order,
    type_id,
  });
};

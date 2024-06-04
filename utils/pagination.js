

export const paginate = (items, page, pageSize = 10) => {
    const offset = (page - 1) * pageSize;
    const paginatedItems = items.slice(offset, offset + pageSize);

    return paginatedItems;

  };
  
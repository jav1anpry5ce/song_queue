const queue = [];

const addToQueue = (data) => {
  queue.push(data);
};

const existingRequests = (id) => {
  const user = queue.filter((item) => item.id === id);
  if (user[0]) {
    return true;
  } else {
    return false;
  }
};

const getQueue = () => queue;

const removeFromQueue = (id) => {
  const index = queue.findIndex((item) => item.id === id);
  if (index !== -1) return queue.splice(index, 1)[0];
};

module.exports = {
  addToQueue,
  getQueue,
  removeFromQueue,
  existingRequests,
};

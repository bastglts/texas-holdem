import Api from './Api';

export default {
  /**
   * Creates a table.
   *
   * Sends a post request to the server.
   *
   * @param {String} tableName Table name.
   *
   * @returns Axios Promise.
   */
  createTable(tableName) {
    return Api().post('table/createtable', { name: tableName })
      .then(response => response.data)
      .catch(err => console.log('createTable err:', err));
  },
};

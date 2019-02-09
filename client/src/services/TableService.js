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
    return Api().post('table/create', { name: tableName })
      .then(response => response.data)
      .catch(err => console.log('createTable err:', err));
  },


  /**
   * Fetches tables list.
   *
   * Sends a get request to the server.
   *
   * @returns Axios Promise.
   */
  fetchTablesList() {
    return Api().get('table/fetchList')
      .then(res => res.data.tablesList)
      .catch(err => console.log('createTable err:', err));
  },
};

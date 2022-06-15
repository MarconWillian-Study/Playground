function LogClass(target: Function) {
  let descriptors = Object.getOwnPropertyDescriptors(target.prototype);

  for (const [propName, descriptor] of Object.entries(descriptors)) {
    const isMethod =
                typeof descriptor.value == 'function' &&
                propName != 'constructor';

    if(!isMethod) continue;

    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {

      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
        const key = `${target.name} - ${propName}`;
        console.log(key, error);
        return error;
      }
    }

    Object.defineProperty(target.prototype, propName, descriptor);
  }
}


@LogClass
class TodoCloudApi {

  async createCard() {
      console.log("method create is called.");
      await new Promise((_,reject) => setTimeout(() => {reject(new Error('Reject when execute create'))}, 1000));
  }

  async deleteCard() {
      console.log("method delete is called.");
      await new Promise((_,reject) => setTimeout(() => {reject(new Error('Reject when execute delete'))}, 1000));
  }
}

console.log('----------------------')

const todoCloudApi = new TodoCloudApi()

console.log('**********************')
console.log(todoCloudApi)

todoCloudApi.createCard()

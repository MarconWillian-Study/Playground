import 'reflect-metadata';

function LogClass(message?: string){
  return (target: Function) => {
    let descriptors = Object.getOwnPropertyDescriptors(target.prototype);

    for (const [propertyKey, descriptor] of Object.entries(descriptors)) {
      const isMethod =
                  typeof descriptor.value == 'function' &&
                  propertyKey != 'constructor';

      if(!isMethod) continue;

      const originalMethod = descriptor.value;

      let callback = Reflect.getMetadata('error:logger:callback', target, propertyKey) as (error: Error) => void;
      let messagePersonal = Reflect.getMetadata('error:logger:message', target, propertyKey) as string;

      descriptor.value = async function (...args: any[]) {
        try {
          const result = await originalMethod.apply(this, args);
          return result;
        } catch (error) {
          if(callback){
            return callback(error as Error);
          }

          if(messagePersonal){
            console.log('- - - -:', messagePersonal);
          } else if(message) {
            console.log('- - - -:', message);
          }

          return error;
        }
      }

      Object.defineProperty(target.prototype, propertyKey, descriptor);
    }
  }
}

export function SetCallbackError(callback: (error: Error) => any) {
  return (target: any, propertyKey: string): void =>  {
    Reflect.defineMetadata('error:logger:callback', callback, target.constructor, propertyKey);
  }
}

export function SetMessage(message: string){
  return (target: any, propertyKey: string): void =>  {
    Reflect.defineMetadata('error:logger:message', message, target.constructor, propertyKey);
  }
}

@LogClass('Global message')
class TodoCloudApi {
  @SetCallbackError((error) => {
    console.log('Callback: ', error);
  })
  async createCard() {
      console.log("method create is called.");
      await new Promise((_,reject) => setTimeout(() => {reject(new Error('Reject when execute create'))}, 1000));
  }

  @SetMessage('Error message personal')
  async deleteCard() {
      console.log("method delete is called.");
      await new Promise((_,reject) => setTimeout(() => {reject(new Error('Reject when execute delete'))}, 1000));
  }
}

console.log('----------------------')

const todoCloudApi = new TodoCloudApi()

console.log('**********************')
console.log(todoCloudApi)

todoCloudApi.deleteCard()

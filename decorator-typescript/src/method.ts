export function LogMethod(errorMessage?: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): void =>  {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
        const key = `${target.constructor.name} - ${propertyKey}`;

        try {
            const result = await originalMethod.apply(this, args);
            return result;
        } catch (error) {
            console.log(key, error);
            if(errorMessage){
              console.log(errorMessage)
              return errorMessage;
            } else {
              return error; // To dando return para não consolar o erro duas vezes aqui neste exemplo
            }
        }
    }
  }
}

class TodoCloudApi {

  @LogMethod()
  async createCard() {
      console.log("method create is called.");
      await new Promise((_,reject) => setTimeout(() => {reject(new Error('Reject when execute create'))}, 1000));
  }

  @LogMethod()
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

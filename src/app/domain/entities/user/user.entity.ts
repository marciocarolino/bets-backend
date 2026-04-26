export class UserEntity {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public password: string,
    public active: boolean,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  activate() {
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }

  changeEmail(newEmail: string) {
    if (!newEmail.includes('@')) {
      throw new Error('Invalid email');
    }
    this.email = newEmail;
  }

  update(data: {
    name?: string,
    email?: string,
    password?: string
  }){
    if(data.name && data.name !== this.name){
      this.name = data.name;
    }

    if( data.email && data.email !== this.email){
      this.email = data.email;
    }

    if(data.password){
      this.password = data.password;
    }

    this.updatedAt = new Date();
  }


}

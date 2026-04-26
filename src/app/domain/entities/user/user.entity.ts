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
    if (!newEmail.includes("@")) {
      throw new Error("Invalid email");
    }
    this.email = newEmail;
  }
}

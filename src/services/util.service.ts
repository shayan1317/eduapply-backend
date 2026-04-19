import { /* inject, */ BindingScope, injectable} from '@loopback/core';

@injectable({scope: BindingScope.TRANSIENT})
export class UtilService {
  constructor() { }

  hasPermission(type: any, roles: any, allowedRoles: any): boolean {
    return allowedRoles.findIndex((allowedRole: any) => {
      if (allowedRole == type) {
        return true;
      }
      return roles.findIndex((userRole: any) => userRole == allowedRole) > -1 ? true : false;
    }) > -1
      ? true
      : false;
  };

  convertTimeStringToNumber(timeStr: string): number {
    let timeParts: string[] = timeStr.split(':');
    return parseFloat(timeParts[0] + '.' + timeParts[1] ? timeParts[1] : '0');
  };

  capitalize(str: string): string {
    let capitalizedStr = '';
    str.split(' ').forEach(word => {
      capitalizedStr += word[0].toUpperCase() + word.slice(1) + ' ';
    });
    return capitalizedStr.trim();
  };

  shallowChildEquality(child: any, parent: any): boolean {
    let child_cp = {...child};

    for (const key in child_cp) {
      if (child_cp[key] != parent[key]) {
        return false;
      }
      delete child_cp[key];
    }
    if (Object.keys(child_cp).length > 0) {
      return false;
    }
    return true;
  };

  generateRandomNumber(length: number = 6): string {
    let i = 0;
    let rand: string = '';
    for (i = 0; i < length; i++) {
      rand += Math.floor(Math.random() * 10)
    }
    return rand;
  }

  getRandomChar(chars: string) {
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };

  generateRandomPassword(length: number = 8): string {
    const capitalLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const smallLetters = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specials = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let password = "";
    let maxChars = Math.floor(length / 4); // maximum number of characters per character type

    // Add one character of each character type
    password += this.getRandomChar(capitalLetters);
    password += this.getRandomChar(smallLetters);
    password += this.getRandomChar(numbers);
    password += this.getRandomChar(specials);

    // Add remaining characters randomly
    while (password.length < length) {
      if (password.length < maxChars * 1) {
        password += this.getRandomChar(capitalLetters);
      } else if (password.length < maxChars * 2) {
        password += this.getRandomChar(smallLetters);
      } else if (password.length < maxChars * 3) {
        password += this.getRandomChar(numbers);
      } else {
        password += this.getRandomChar(specials);
      }
    }
    return password;
  };

}

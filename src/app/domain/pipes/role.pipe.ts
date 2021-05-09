import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'role' })
export class RolePipe implements PipeTransform {
  transform(input: string): string {
    if (input && input.length && input.startsWith('ROLE_')) {
      const role: string = input.slice(5);
      return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    }
    return input;
  }
}

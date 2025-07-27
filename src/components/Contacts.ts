import { IEvents } from './base/events';
import { Form } from './common/Form';

export interface IContacts {
  phone: string;
  email: string;
}

export class Contacts extends Form<IContacts> {
	constructor(container: HTMLFormElement, events: IEvents) {
    	super(container, events);
  	}

	resetInputs(){
		(this.container.elements.namedItem('phone') as HTMLInputElement).value = "";
		 (this.container.elements.namedItem('email') as HTMLInputElement).value = "";
	}
}
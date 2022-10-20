import {Component} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Character, Query } from 'types';
import { ModalComponent } from './modal/modal.component';


const GET_CHARACTERS = gql`
query GetCharacters($page: Int) {
  characters(page: $page) {
    results {
      name
      image
    }
  }
}
`

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  modalRef: MdbModalRef<ModalComponent> | null = null;
  page: number
  characters: Character[] = []

  config = {
    animation: true,
    backdrop: true,
    containerClass: '',
    data: {
      title: 'Custom title'
    },
    ignoreBackdropClick: false,
    keyboard: true,
    modalClass: 'modal-fullscreen'
  }

  constructor(private modalService: MdbModalService,
              private apollo: Apollo) {
    this.page = 1
    this.getCharacters()
  }

  openModal() {
    this.modalRef = this.modalService.open(ModalComponent, this.config)
  }

  private getCharacters() {
    this.characters = []
    this.apollo
      .watchQuery<Query>(
        {
          query: GET_CHARACTERS,
          variables: {
            page: this.page
          }
        }
      )
      .valueChanges
      .subscribe((res: any) => {
        res.data.characters.results.forEach((element: Character) => {
          this.characters.push(element)
        });
      })
  }

  back() {
    this.page -= 1
    this.getCharacters()
  }

  next() {
    this.page += 1
    this.getCharacters()
  }
}

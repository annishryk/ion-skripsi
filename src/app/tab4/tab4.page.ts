import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  thnAkademik: string;
  data: any;
  url: string;
  header = new Headers({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Accept: 'application/json',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/json',
  });
  constructor(private loadingCtrl: LoadingController) {}
  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
      this.ngOnInit();
    }, 2000);
  }
  ngOnInit(): void {
    this.url =
      'https://gebyar-it.xyz/latihan/LoginSession/getBimbinganInfo.php';
    fetch(this.url, {
      method: 'GET',
      headers: this.header,
    })
      .then((res) => res.json())
      .then((res) => {
        this.data = res.data;
      });
  }
  async postTahun() {
    const data = {
      thn_akademik: this.thnAkademik,
    };
    const loading = await this.loadingCtrl.create({
      message: 'Loading',
      showBackdrop: true,
    });
    loading.present();
    this.url =
      'https://gebyar-it.xyz/latihan/LoginSession/getBimbinganInfo.php';
    fetch(this.url, {
      method: 'POST',
      headers: this.header,
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        this.data = res.data;
        loading.dismiss();
      });
  }
}

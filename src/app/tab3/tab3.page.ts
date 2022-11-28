import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  kdbimbingan: number;
  data: any;
  isModalOpen = false;
  modalData: any;
  url: string;

  header = new Headers({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Accept: 'application/json',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/json',
  });
  constructor(
    private storage: Storage,
    private http: HttpClient,
    private loadingCtrl: LoadingController
  ) {}
  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }
  ngOnInit(): void {
    this.storage.get('kd_bimbingan').then(async (val) => {
      const loading = await this.loadingCtrl.create({
        message: 'Loading',
        showBackdrop: true,
      });
      loading.present();
      console.log(val);
      this.kdbimbingan = val;
      const data = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        kd_bimbingan: this.kdbimbingan,
      };
      this.url =
        'https://gebyar-it.xyz/latihan/LoginSession/getDataCapture.php';
      fetch(this.url, {
        method: 'POST',
        headers: this.header,
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          loading.dismiss();
          this.data = res.data;
          // eslint-disable-next-line prefer-const
        });
    });
  }

  async setOpen(isOpen: boolean, data) {
    this.isModalOpen = isOpen;
    const formData = new FormData();
    formData.append('dentry', data);
    this.url =
      'https://gebyar-it.xyz/latihan/LoginSession/getDetailDataCapture.php';
    this.http.post(this.url, formData).subscribe((res) => {
      this.modalData = res;
    });
  }
}

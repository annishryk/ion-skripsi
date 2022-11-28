import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastController, LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  loaded = false;
  tahunAkademik: string;
  thnAkademik: string;

  dosen: string;
  topik: string;
  judul: string;
  dentry: Date = new Date();
  img: File = null;
  data: any;
  kdBimbingan: string;
  description: string;
  urlImage = '../assets/default.jpg';
  header = new Headers({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Accept: 'application/json',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/json',
  });
  constructor(
    private storage: Storage,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private loadCtrl: LoadingController
  ) {}

  ngOnInit(): void {
    this.storage.get('isLoggedIn').then((val) => {
      this.data = {
        npm: val.npm,
      };
      const url =
        'http://gebyar-it.xyz/latihan/LoginSession/getBimbinganData.php';
      fetch(url, {
        method: 'POST',
        headers: this.header,
        body: JSON.stringify(this.data),
      })
        .then((res) => res.json())
        .then((res) => {
          this.thnAkademik = res.thn_akademik;
          if (this.tahunAkademik === undefined) {
            this.tahunAkademik = this.thnAkademik;
          }
          this.topik = res.topik;
          this.judul = res.judul;
          this.dosen = res.nama_dosen;
          this.loaded = true;
          this.kdBimbingan = res.kd_bimbingan;
        });
    });
  }
  async presentToast(m, c) {
    const toast = await this.toastCtrl.create({
      message: m,
      duration: 3000,
      position: 'top',
      color: c,
    });
    toast.present();
  }
  imageUpload(event) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    this.img = <File>event.target.files[0];
    if (event.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.urlImage = e.target.result;
      };
    }
  }
  async uploadData() {
    let result: Observable<any>;
    const loading = await this.loadCtrl.create({
      message: 'Please Wait',
    });
    const formData = new FormData();
    formData.append('kd_bimbingan', this.kdBimbingan);
    formData.append('desc', this.description);
    formData.append('image', this.img);
    formData.append('dentry', this.dentry.toString());
    formData.append('thn_akademik', this.thnAkademik);
    if (
      this.dentry === null ||
      this.dentry === undefined ||
      this.description === null ||
      this.description === undefined ||
      this.img === null ||
      this.img === undefined
    ) {
      this.presentToast('These Inputs Cannot Be Empty!', 'danger');
    } else {
      const url =
        'http://gebyar-it.xyz/latihan/LoginSession/uploadBimbinganCapture.php';
      result = this.http.post(url, formData);
      result.subscribe((res) => {
        {
          this.data = res;
          if (this.data.error === true) {
            loading.dismiss();
            this.presentToast(this.data.message, 'danger');
          } else {
            loading.dismiss();
            this.presentToast('Data Successfully Uploaded', 'primary');
            this.urlImage = '../assets/default.jpg';
          }
        }
      });
    }
  }
}

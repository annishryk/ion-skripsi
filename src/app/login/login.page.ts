import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import {
  ToastController,
  NavController,
  LoadingController,
} from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  constructor(
    private storage: Storage,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}
  async displayToast(messages) {
    await this.toastCtrl
      .create({
        color: 'danger',
        duration: 2000,
        message: messages,
        position: 'top',
      })
      .then((toast) => toast.present());
  }

  async login() {
    if (this.username === '' || this.password === '') {
      this.displayToast('Inputs cannot be empty!');
    } else {
      const loader = await this.loadingCtrl.create({
        message: 'Please wait...',
      });
      loader.present();
      const url = 'https://gebyar-it.xyz/latihan/LoginSession/login.php';
      const data = {
        username: this.username,
        pass: this.password,
      };
      const header = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Accept: 'application/json',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      };
      try {
        await this.storage.create();
        fetch(url, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: header,
        })
          .then((res) => res.json())
          .then(async (results) => {
            console.log(results);
            if (results.error === false) {
              await this.storage.set('isLoggedIn', results.result);
              this.navCtrl.navigateForward('/tabs/tab1');
              loader.dismiss();
            } else {
              this.displayToast(results.error);
            }
          })
          .catch((err) => {
            loader.dismiss();
            this.displayToast(err);
          });
      } catch (error) {
        loader.dismiss();
        this.displayToast(error);
      }
    }
  }
}

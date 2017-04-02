import UIKit

class MessageViewController: UIViewController, UIWebViewDelegate {
    
    var loadingIndicator: UIActivityIndicatorView = {
        let loadingInd: UIActivityIndicatorView = UIActivityIndicatorView()
        loadingInd.activityIndicatorViewStyle = .gray
        loadingInd.startAnimating()
        loadingInd.scale(factor: 3.0)
        return loadingInd
    }()

    override func viewDidLoad() {
        super.viewDidLoad()
        let myFrame = CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height)
        let webV:UIWebView = UIWebView(frame: myFrame)
        
        
        let request:URLRequest = URLRequest(url: NSURL(string: "https://webchat.botframework.com/embed/ANewBot?s=vT4Se7ZlN-A.cwA.Hio.5OMcDJd42lNd2e4-pA52t3iAlyqZb7Vc1qNl4vy5tWc")! as URL)
//        let request:URLRequest = URLRequest(url: NSURL(string: "https://deployliusbot.azurewebsites.net/api/messages")! as URL)
        webV.loadRequest(request)
        webV.delegate = self
        self.view.addSubview(webV)
        loadingIndicator.frame = myFrame
        loadingIndicator.center = self.view.center
        self.view.addSubview(loadingIndicator)

    }
    
    func webView(_ webView: UIWebView, didFailLoadWithError error: Error) {
        print("Webview fail with error \(error)");
    }
    func webViewDidStartLoad(_ webView: UIWebView) {
        print("Webview started Loading")
    }
    func webViewDidFinishLoad(_ webView: UIWebView) {
        print("Webview did finish load")
        loadingIndicator.stopAnimating()
    }


}

extension UIActivityIndicatorView {
    func scale(factor: CGFloat) {
        guard factor > 0.0 else { return }
        
        transform = CGAffineTransform(scaleX: factor, y: factor)
    }
}

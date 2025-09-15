import 'dart:io';

import 'package:flutter/widgets.dart';

class Server {
  static Server? _runServer;
  Process? _process;

  Server._createInstance();

  factory Server() {
    _runServer = _runServer ?? Server._createInstance();
    return _runServer!;
  }

  Future<void> start() async {
    if (_process != null) {
      return;
    }
    try {
      Process _pwd = await Process.start("ls", ["-l"]);
      stdout.write(_pwd.stderr);
      _process = await Process.start("npm", [
        "run",
        "dev",
      ], workingDirectory: "./food_odering_backend");
      stdout.write(_process!.stdout);
      stdout.write(_process!.stderr);
      debugPrint("Process started with PID: ${_process!.pid}");
    } catch (error) {
      debugPrint(
        "Error cannot start server, why? Because fuck you!: ${error.toString()}",
      );
    }
  }

  Future<void> stop() async {
    if (_process == null) {
      return;
    }
    bool killed = _process!.kill(ProcessSignal.sigterm);
    if (killed) {
      debugPrint("Server successfully killed");
    } else {
      debugPrint("Server cannot be killed because, why? Because fuck you!");
    }
  }
}

package com.pakworld.pakautoreply;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.pakworld.pakautoreply.engine.ReplyEngine;
import com.pakworld.pakautoreply.engine.ReplyResult;

public class TestReplyActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_test_reply);

        EditText etMsg = findViewById(R.id.et_incoming_test_msg);
        Button btnRun = findViewById(R.id.btn_run_test);
        TextView tvTrace = findViewById(R.id.tv_trace_rule);
        TextView tvResult = findViewById(R.id.tv_test_reply_result);

        btnRun.setOnClickListener(v -> {
            String incoming = etMsg.getText().toString().trim();
            if (incoming.isEmpty()) {
                incoming = "timing";
            }

            final String query = incoming;
            tvResult.setText("Evaluating through ReplyEngine pipeline...");

            new Thread(() -> {
                ReplyResult res = ReplyEngine.processMessage(TestReplyActivity.this, query, "+923001234567", false);
                runOnUiThread(() -> {
                    tvTrace.setText("Pipeline Trigger: " + res.matchedType.toUpperCase() + " (" + (res.ruleName != null ? res.ruleName : res.providerUsed) + ")");
                    tvResult.setText(res.replyText);
                });
            }).start();
        });
    }
}

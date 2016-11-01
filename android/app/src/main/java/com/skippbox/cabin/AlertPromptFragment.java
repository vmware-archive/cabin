package com.skippbox.cabin;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AlertDialog;
import android.widget.EditText;

public class AlertPromptFragment extends DialogFragment implements DialogInterface.OnClickListener {

    AlertPromptModule.AlertFragmentListener mListener;

    private EditText mEditText;

    public AlertPromptFragment() {
        super();
    }

    @SuppressLint("ValidFragment")
    public AlertPromptFragment(@Nullable AlertPromptModule.AlertFragmentListener listener, Bundle arguments) {
        super();
        setArguments(arguments);
        mListener = listener;
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        return createDialog(getActivity(), getArguments(), this);
    }

    private Dialog createDialog(Context context, Bundle arguments, DialogInterface.OnClickListener listener) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);

        if (arguments.containsKey("title")) {
            builder.setTitle(arguments.getString("title"));
        }
        if (arguments.containsKey("message")) {
            builder.setMessage(arguments.getString("message"));
        }

        mEditText = new EditText(context);
        builder.setView(mEditText);
        builder.setCancelable(true);

        String[] actions = arguments.getStringArray("actions");
        builder.setNegativeButton(actions[0], listener);
        builder.setPositiveButton(actions[1], listener);
        return builder.create();
    }

    @Override
    public void onClick(DialogInterface dialog, int which) {
        if (mListener != null) {
            mListener.onClick(dialog, which == DialogInterface.BUTTON_NEGATIVE ? 0 : 1, mEditText.getText().toString());
        }
    }

    @Override
    public void onDismiss(DialogInterface dialog) {
        super.onDismiss(dialog);
        if (mListener != null) {
            mListener.onDismiss(dialog);
        }
    }
}
